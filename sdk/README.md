# Squad Planner SDK

Official SDKs for integrating with the Squad Planner API. Available in JavaScript/TypeScript, Python, and C#.

## Installation

### JavaScript/TypeScript

```bash
npm install @squadplanner/sdk
# or
yarn add @squadplanner/sdk
```

### Python

```bash
pip install squadplanner-sdk
```

### C# (.NET)

```bash
dotnet add package SquadPlanner.SDK
# or via NuGet
Install-Package SquadPlanner.SDK
```

## Quick Start

### JavaScript/TypeScript

```typescript
import { SquadPlannerSDK } from '@squadplanner/sdk';

const sdk = new SquadPlannerSDK({
  apiKey: 'your-api-key'
});

// Get all squads
const { data: squads } = await sdk.getSquads();
console.log(squads);

// Create a session
const { data: session } = await sdk.createSession('squad-id', {
  title: 'Ranked Night',
  scheduled_date: '2024-01-15',
  scheduled_time: '21:00',
  duration: 120
});
```

### Python

```python
from squadplanner import SquadPlannerSDK

sdk = SquadPlannerSDK(api_key="your-api-key")

# Get all squads
squads = sdk.get_squads()
for squad in squads:
    print(f"{squad.name} ({squad.game})")

# Create a session
session = sdk.create_session(
    squad_id="squad-id",
    title="Ranked Night",
    scheduled_date="2024-01-15",
    scheduled_time="21:00",
    duration=120
)
```

### C#

```csharp
using SquadPlanner.SDK;

var client = new SquadPlannerClient("your-api-key");

// Get all squads
var squads = await client.GetSquadsAsync();
foreach (var squad in squads)
{
    Console.WriteLine($"{squad.Name} ({squad.Game})");
}

// Create a session
var session = await client.CreateSessionAsync("squad-id", new CreateSessionRequest
{
    Title = "Ranked Night",
    ScheduledDate = "2024-01-15",
    ScheduledTime = "21:00",
    Duration = 120
});
```

## API Reference

### Squads

| Method | Description |
|--------|-------------|
| `getSquads()` | Get all squads for the authenticated user |
| `getSquad(squadId)` | Get a specific squad by ID |
| `createSquad(data)` | Create a new squad |
| `updateSquad(squadId, data)` | Update a squad |
| `deleteSquad(squadId)` | Delete a squad |
| `getSquadMembers(squadId)` | Get squad members |
| `inviteMember(squadId, email)` | Invite a member to squad |

### Sessions

| Method | Description |
|--------|-------------|
| `getSessions(squadId)` | Get all sessions for a squad |
| `getSession(sessionId)` | Get a specific session |
| `createSession(squadId, data)` | Create a new session |
| `updateSession(sessionId, data)` | Update a session |
| `cancelSession(sessionId)` | Cancel a session |
| `getSessionRSVPs(sessionId)` | Get RSVPs for a session |
| `submitRSVP(sessionId, response)` | Submit an RSVP |

### Webhooks

| Method | Description |
|--------|-------------|
| `getWebhooks(squadId)` | Get all webhooks for a squad |
| `createWebhook(squadId, data)` | Create a webhook |
| `deleteWebhook(webhookId)` | Delete a webhook |

### Analytics

| Method | Description |
|--------|-------------|
| `getSquadAnalytics(squadId, period)` | Get squad analytics |
| `getUserAnalytics(period)` | Get user analytics |

## Webhook Events

Available webhook events:
- `session.created` - When a new session is created
- `session.updated` - When a session is updated
- `session.cancelled` - When a session is cancelled
- `member.joined` - When a member joins the squad
- `member.left` - When a member leaves the squad
- `rsvp.submitted` - When an RSVP is submitted

## Error Handling

All SDKs throw specific exceptions on errors:

### JavaScript/TypeScript
```typescript
try {
  await sdk.getSquad('invalid-id');
} catch (error) {
  console.error(`Error ${error.status}: ${error.message}`);
}
```

### Python
```python
try:
    sdk.get_squad('invalid-id')
except SquadPlannerError as e:
    print(f"Error {e.status_code}: {e.message}")
```

### C#
```csharp
try
{
    await client.GetSquadAsync("invalid-id");
}
catch (SquadPlannerException e)
{
    Console.WriteLine($"Error {e.StatusCode}: {e.Message}");
}
```

## Rate Limits

- 100 requests per minute for free tier
- 1000 requests per minute for premium tier
- 10000 requests per minute for enterprise tier

## Support

- Documentation: https://docs.squadplanner.app
- Email: support@squadplanner.app
- Discord: https://discord.gg/squadplanner

## License

MIT License - see LICENSE file for details.
