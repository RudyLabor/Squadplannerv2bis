"""
Squad Planner Python SDK
Official SDK for integrating with Squad Planner API
Version: 1.0.0
"""

import requests
from typing import Optional, List, Dict, Any, Literal
from dataclasses import dataclass
from datetime import datetime
import json


@dataclass
class Squad:
    id: str
    name: str
    game: str
    member_count: int
    created_at: str
    description: Optional[str] = None
    avatar_url: Optional[str] = None


@dataclass
class Session:
    id: str
    squad_id: str
    title: str
    scheduled_date: str
    scheduled_time: str
    duration: int
    status: str
    created_by: str
    description: Optional[str] = None
    max_players: Optional[int] = None


@dataclass
class Member:
    id: str
    user_id: str
    squad_id: str
    role: str
    joined_at: str
    display_name: str
    avatar_url: Optional[str] = None


@dataclass
class RSVP:
    id: str
    session_id: str
    user_id: str
    response: str
    responded_at: str


@dataclass
class Webhook:
    id: str
    squad_id: str
    url: str
    events: List[str]
    is_active: bool
    secret: Optional[str] = None


class SquadPlannerError(Exception):
    """Base exception for Squad Planner SDK"""
    def __init__(self, message: str, status_code: int = None):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class SquadPlannerSDK:
    """
    Squad Planner Python SDK

    Usage:
        sdk = SquadPlannerSDK(api_key="your-api-key")
        squads = sdk.get_squads()
    """

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.squadplanner.app/v1",
        timeout: int = 30
    ):
        self.api_key = api_key
        self.base_url = base_url
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
            "X-SDK-Version": "1.0.0"
        })

    def _request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """Make an HTTP request to the API"""
        url = f"{self.base_url}{endpoint}"

        try:
            response = self.session.request(
                method=method,
                url=url,
                json=data,
                params=params,
                timeout=self.timeout
            )

            result = response.json()

            if not response.ok:
                raise SquadPlannerError(
                    message=result.get("message", "An error occurred"),
                    status_code=response.status_code
                )

            return result

        except requests.exceptions.Timeout:
            raise SquadPlannerError("Request timeout", 408)
        except requests.exceptions.RequestException as e:
            raise SquadPlannerError(str(e))

    # ============ SQUADS ============

    def get_squads(self) -> List[Squad]:
        """Get all squads for the authenticated user"""
        data = self._request("GET", "/squads")
        return [Squad(**s) for s in data]

    def get_squad(self, squad_id: str) -> Squad:
        """Get a specific squad by ID"""
        data = self._request("GET", f"/squads/{squad_id}")
        return Squad(**data)

    def create_squad(
        self,
        name: str,
        game: str,
        description: Optional[str] = None,
        avatar_url: Optional[str] = None
    ) -> Squad:
        """Create a new squad"""
        data = self._request("POST", "/squads", data={
            "name": name,
            "game": game,
            "description": description,
            "avatar_url": avatar_url
        })
        return Squad(**data)

    def update_squad(self, squad_id: str, **kwargs) -> Squad:
        """Update a squad"""
        data = self._request("PATCH", f"/squads/{squad_id}", data=kwargs)
        return Squad(**data)

    def delete_squad(self, squad_id: str) -> None:
        """Delete a squad"""
        self._request("DELETE", f"/squads/{squad_id}")

    def get_squad_members(self, squad_id: str) -> List[Member]:
        """Get squad members"""
        data = self._request("GET", f"/squads/{squad_id}/members")
        return [Member(**m) for m in data]

    def invite_member(self, squad_id: str, email: str) -> Dict[str, str]:
        """Invite a member to squad"""
        return self._request("POST", f"/squads/{squad_id}/invite", data={
            "email": email
        })

    # ============ SESSIONS ============

    def get_sessions(self, squad_id: str) -> List[Session]:
        """Get all sessions for a squad"""
        data = self._request("GET", f"/squads/{squad_id}/sessions")
        return [Session(**s) for s in data]

    def get_session(self, session_id: str) -> Session:
        """Get a specific session"""
        data = self._request("GET", f"/sessions/{session_id}")
        return Session(**data)

    def create_session(
        self,
        squad_id: str,
        title: str,
        scheduled_date: str,
        scheduled_time: str,
        duration: int,
        description: Optional[str] = None,
        max_players: Optional[int] = None
    ) -> Session:
        """Create a new session"""
        data = self._request("POST", f"/squads/{squad_id}/sessions", data={
            "title": title,
            "scheduled_date": scheduled_date,
            "scheduled_time": scheduled_time,
            "duration": duration,
            "description": description,
            "max_players": max_players
        })
        return Session(**data)

    def update_session(self, session_id: str, **kwargs) -> Session:
        """Update a session"""
        data = self._request("PATCH", f"/sessions/{session_id}", data=kwargs)
        return Session(**data)

    def cancel_session(self, session_id: str) -> Session:
        """Cancel a session"""
        data = self._request("POST", f"/sessions/{session_id}/cancel")
        return Session(**data)

    def get_session_rsvps(self, session_id: str) -> List[RSVP]:
        """Get RSVPs for a session"""
        data = self._request("GET", f"/sessions/{session_id}/rsvps")
        return [RSVP(**r) for r in data]

    def submit_rsvp(
        self,
        session_id: str,
        response: Literal["going", "maybe", "not_going"]
    ) -> RSVP:
        """Submit an RSVP"""
        data = self._request("POST", f"/sessions/{session_id}/rsvp", data={
            "response": response
        })
        return RSVP(**data)

    # ============ WEBHOOKS ============

    def get_webhooks(self, squad_id: str) -> List[Webhook]:
        """Get all webhooks for a squad"""
        data = self._request("GET", f"/squads/{squad_id}/webhooks")
        return [Webhook(**w) for w in data]

    def create_webhook(
        self,
        squad_id: str,
        url: str,
        events: List[str]
    ) -> Webhook:
        """Create a webhook"""
        data = self._request("POST", f"/squads/{squad_id}/webhooks", data={
            "url": url,
            "events": events
        })
        return Webhook(**data)

    def delete_webhook(self, webhook_id: str) -> None:
        """Delete a webhook"""
        self._request("DELETE", f"/webhooks/{webhook_id}")

    # ============ ANALYTICS ============

    def get_squad_analytics(
        self,
        squad_id: str,
        period: Literal["daily", "weekly", "monthly"] = "weekly"
    ) -> Dict[str, Any]:
        """Get squad analytics"""
        return self._request(
            "GET",
            f"/squads/{squad_id}/analytics",
            params={"period": period}
        )

    def get_user_analytics(
        self,
        period: Literal["daily", "weekly", "monthly"] = "weekly"
    ) -> Dict[str, Any]:
        """Get user analytics"""
        return self._request("GET", "/me/analytics", params={"period": period})


# Example usage
if __name__ == "__main__":
    # Initialize SDK
    sdk = SquadPlannerSDK(api_key="your-api-key")

    # Get all squads
    squads = sdk.get_squads()
    for squad in squads:
        print(f"Squad: {squad.name} ({squad.game})")

    # Create a session
    session = sdk.create_session(
        squad_id="squad-123",
        title="Ranked Night",
        scheduled_date="2024-01-15",
        scheduled_time="21:00",
        duration=120
    )
    print(f"Created session: {session.title}")
