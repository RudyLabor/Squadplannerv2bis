/**
 * Squad Planner C# SDK
 * Official SDK for integrating with Squad Planner API
 * Version: 1.0.0
 */

using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SquadPlanner.SDK
{
    #region Models

    public class Squad
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("game")]
        public string Game { get; set; }

        [JsonPropertyName("avatar_url")]
        public string AvatarUrl { get; set; }

        [JsonPropertyName("member_count")]
        public int MemberCount { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }
    }

    public class Session
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("squad_id")]
        public string SquadId { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("scheduled_date")]
        public string ScheduledDate { get; set; }

        [JsonPropertyName("scheduled_time")]
        public string ScheduledTime { get; set; }

        [JsonPropertyName("duration")]
        public int Duration { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("created_by")]
        public string CreatedBy { get; set; }

        [JsonPropertyName("max_players")]
        public int? MaxPlayers { get; set; }
    }

    public class Member
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("user_id")]
        public string UserId { get; set; }

        [JsonPropertyName("squad_id")]
        public string SquadId { get; set; }

        [JsonPropertyName("role")]
        public string Role { get; set; }

        [JsonPropertyName("joined_at")]
        public string JoinedAt { get; set; }

        [JsonPropertyName("display_name")]
        public string DisplayName { get; set; }

        [JsonPropertyName("avatar_url")]
        public string AvatarUrl { get; set; }
    }

    public class RSVP
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("session_id")]
        public string SessionId { get; set; }

        [JsonPropertyName("user_id")]
        public string UserId { get; set; }

        [JsonPropertyName("response")]
        public string Response { get; set; }

        [JsonPropertyName("responded_at")]
        public string RespondedAt { get; set; }
    }

    public class Webhook
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("squad_id")]
        public string SquadId { get; set; }

        [JsonPropertyName("url")]
        public string Url { get; set; }

        [JsonPropertyName("events")]
        public List<string> Events { get; set; }

        [JsonPropertyName("is_active")]
        public bool IsActive { get; set; }

        [JsonPropertyName("secret")]
        public string Secret { get; set; }
    }

    public class SquadAnalytics
    {
        [JsonPropertyName("sessions_count")]
        public int SessionsCount { get; set; }

        [JsonPropertyName("avg_attendance")]
        public double AvgAttendance { get; set; }

        [JsonPropertyName("total_hours")]
        public double TotalHours { get; set; }

        [JsonPropertyName("member_activity")]
        public Dictionary<string, int> MemberActivity { get; set; }
    }

    public class UserAnalytics
    {
        [JsonPropertyName("sessions_attended")]
        public int SessionsAttended { get; set; }

        [JsonPropertyName("reliability_score")]
        public double ReliabilityScore { get; set; }

        [JsonPropertyName("total_hours")]
        public double TotalHours { get; set; }

        [JsonPropertyName("streak")]
        public int Streak { get; set; }
    }

    #endregion

    #region Request Models

    public class CreateSquadRequest
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("game")]
        public string Game { get; set; }

        [JsonPropertyName("avatar_url")]
        public string AvatarUrl { get; set; }
    }

    public class CreateSessionRequest
    {
        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("scheduled_date")]
        public string ScheduledDate { get; set; }

        [JsonPropertyName("scheduled_time")]
        public string ScheduledTime { get; set; }

        [JsonPropertyName("duration")]
        public int Duration { get; set; }

        [JsonPropertyName("max_players")]
        public int? MaxPlayers { get; set; }
    }

    public class CreateWebhookRequest
    {
        [JsonPropertyName("url")]
        public string Url { get; set; }

        [JsonPropertyName("events")]
        public List<string> Events { get; set; }
    }

    public class RSVPRequest
    {
        [JsonPropertyName("response")]
        public string Response { get; set; }
    }

    public class InviteRequest
    {
        [JsonPropertyName("email")]
        public string Email { get; set; }
    }

    public class InviteResponse
    {
        [JsonPropertyName("invite_code")]
        public string InviteCode { get; set; }
    }

    #endregion

    #region Exceptions

    public class SquadPlannerException : Exception
    {
        public int StatusCode { get; }

        public SquadPlannerException(string message, int statusCode = 0)
            : base(message)
        {
            StatusCode = statusCode;
        }
    }

    #endregion

    /// <summary>
    /// Squad Planner C# SDK
    /// Official SDK for integrating with Squad Planner API
    /// </summary>
    public class SquadPlannerClient : IDisposable
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;
        private readonly JsonSerializerOptions _jsonOptions;

        /// <summary>
        /// Initialize the Squad Planner SDK
        /// </summary>
        /// <param name="apiKey">Your API key</param>
        /// <param name="baseUrl">Optional custom base URL</param>
        /// <param name="timeout">Request timeout in seconds</param>
        public SquadPlannerClient(
            string apiKey,
            string baseUrl = "https://api.squadplanner.app/v1",
            int timeout = 30)
        {
            _baseUrl = baseUrl;
            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(timeout)
            };
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);
            _httpClient.DefaultRequestHeaders.Add("X-SDK-Version", "1.0.0");

            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };
        }

        private async Task<T> RequestAsync<T>(
            HttpMethod method,
            string endpoint,
            object data = null)
        {
            var request = new HttpRequestMessage(method, $"{_baseUrl}{endpoint}");

            if (data != null)
            {
                var json = JsonSerializer.Serialize(data, _jsonOptions);
                request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            }

            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new SquadPlannerException(
                    $"API Error: {content}",
                    (int)response.StatusCode);
            }

            if (string.IsNullOrEmpty(content) || content == "null")
            {
                return default;
            }

            return JsonSerializer.Deserialize<T>(content, _jsonOptions);
        }

        #region Squads

        /// <summary>Get all squads for the authenticated user</summary>
        public Task<List<Squad>> GetSquadsAsync()
            => RequestAsync<List<Squad>>(HttpMethod.Get, "/squads");

        /// <summary>Get a specific squad by ID</summary>
        public Task<Squad> GetSquadAsync(string squadId)
            => RequestAsync<Squad>(HttpMethod.Get, $"/squads/{squadId}");

        /// <summary>Create a new squad</summary>
        public Task<Squad> CreateSquadAsync(CreateSquadRequest request)
            => RequestAsync<Squad>(HttpMethod.Post, "/squads", request);

        /// <summary>Update a squad</summary>
        public Task<Squad> UpdateSquadAsync(string squadId, CreateSquadRequest request)
            => RequestAsync<Squad>(HttpMethod.Patch, $"/squads/{squadId}", request);

        /// <summary>Delete a squad</summary>
        public Task DeleteSquadAsync(string squadId)
            => RequestAsync<object>(HttpMethod.Delete, $"/squads/{squadId}");

        /// <summary>Get squad members</summary>
        public Task<List<Member>> GetSquadMembersAsync(string squadId)
            => RequestAsync<List<Member>>(HttpMethod.Get, $"/squads/{squadId}/members");

        /// <summary>Invite a member to squad</summary>
        public Task<InviteResponse> InviteMemberAsync(string squadId, string email)
            => RequestAsync<InviteResponse>(
                HttpMethod.Post,
                $"/squads/{squadId}/invite",
                new InviteRequest { Email = email });

        #endregion

        #region Sessions

        /// <summary>Get all sessions for a squad</summary>
        public Task<List<Session>> GetSessionsAsync(string squadId)
            => RequestAsync<List<Session>>(HttpMethod.Get, $"/squads/{squadId}/sessions");

        /// <summary>Get a specific session</summary>
        public Task<Session> GetSessionAsync(string sessionId)
            => RequestAsync<Session>(HttpMethod.Get, $"/sessions/{sessionId}");

        /// <summary>Create a new session</summary>
        public Task<Session> CreateSessionAsync(string squadId, CreateSessionRequest request)
            => RequestAsync<Session>(HttpMethod.Post, $"/squads/{squadId}/sessions", request);

        /// <summary>Update a session</summary>
        public Task<Session> UpdateSessionAsync(string sessionId, CreateSessionRequest request)
            => RequestAsync<Session>(HttpMethod.Patch, $"/sessions/{sessionId}", request);

        /// <summary>Cancel a session</summary>
        public Task<Session> CancelSessionAsync(string sessionId)
            => RequestAsync<Session>(HttpMethod.Post, $"/sessions/{sessionId}/cancel");

        /// <summary>Get RSVPs for a session</summary>
        public Task<List<RSVP>> GetSessionRSVPsAsync(string sessionId)
            => RequestAsync<List<RSVP>>(HttpMethod.Get, $"/sessions/{sessionId}/rsvps");

        /// <summary>Submit an RSVP</summary>
        public Task<RSVP> SubmitRSVPAsync(string sessionId, string response)
            => RequestAsync<RSVP>(
                HttpMethod.Post,
                $"/sessions/{sessionId}/rsvp",
                new RSVPRequest { Response = response });

        #endregion

        #region Webhooks

        /// <summary>Get all webhooks for a squad</summary>
        public Task<List<Webhook>> GetWebhooksAsync(string squadId)
            => RequestAsync<List<Webhook>>(HttpMethod.Get, $"/squads/{squadId}/webhooks");

        /// <summary>Create a webhook</summary>
        public Task<Webhook> CreateWebhookAsync(string squadId, CreateWebhookRequest request)
            => RequestAsync<Webhook>(HttpMethod.Post, $"/squads/{squadId}/webhooks", request);

        /// <summary>Delete a webhook</summary>
        public Task DeleteWebhookAsync(string webhookId)
            => RequestAsync<object>(HttpMethod.Delete, $"/webhooks/{webhookId}");

        #endregion

        #region Analytics

        /// <summary>Get squad analytics</summary>
        public Task<SquadAnalytics> GetSquadAnalyticsAsync(
            string squadId,
            string period = "weekly")
            => RequestAsync<SquadAnalytics>(
                HttpMethod.Get,
                $"/squads/{squadId}/analytics?period={period}");

        /// <summary>Get user analytics</summary>
        public Task<UserAnalytics> GetUserAnalyticsAsync(string period = "weekly")
            => RequestAsync<UserAnalytics>(HttpMethod.Get, $"/me/analytics?period={period}");

        #endregion

        public void Dispose()
        {
            _httpClient?.Dispose();
        }
    }
}

/*
 * Example Usage:
 *
 * using SquadPlanner.SDK;
 *
 * var client = new SquadPlannerClient("your-api-key");
 *
 * // Get all squads
 * var squads = await client.GetSquadsAsync();
 * foreach (var squad in squads)
 * {
 *     Console.WriteLine($"Squad: {squad.Name} ({squad.Game})");
 * }
 *
 * // Create a session
 * var session = await client.CreateSessionAsync("squad-123", new CreateSessionRequest
 * {
 *     Title = "Ranked Night",
 *     ScheduledDate = "2024-01-15",
 *     ScheduledTime = "21:00",
 *     Duration = 120
 * });
 *
 * Console.WriteLine($"Created session: {session.Title}");
 */
