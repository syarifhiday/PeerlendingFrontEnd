using Microsoft.AspNetCore.Mvc;
using PeerLendingFE.DTO.Req;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PeerLendingFE.Controllers.api
{
	public class ApiTrnLendingController : Controller
	{
		private readonly HttpClient _httpClient;
		public ApiTrnLendingController(HttpClient httpClient)
		{
			_httpClient = httpClient;
		}

		[HttpPost]
		public async Task<IActionResult> PayLoan(string id, [FromBody] ReqPayLendingDto reqPayLendingDto)
		{
			if (string.IsNullOrEmpty(id))
			{
				return BadRequest("Request cannot be null");
			}

			var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
			_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
			var json = JsonSerializer.Serialize(reqPayLendingDto);
			var content = new StringContent(json, Encoding.UTF8, "application/json");

			// Send request to change loan status to 'funded'
			var response = await _httpClient.PutAsync($"https://localhost:7158/api/v1/repayment/UpdateRepayment/{id}", content);

			if (response.IsSuccessStatusCode)
			{
				return Ok("Loan status changed successfully");
			}
			else
			{
				return BadRequest("Failed to change pay lending");
			}
		}

		[HttpGet]
		public async Task<IActionResult> GetLendings()
		{
			var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
			// Decode the JWT token to extract claims
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Extract borrower_id from the claims (adjust claim type as necessary)
            var borrowerIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "Id"); // or whatever the claim type is
            if (borrowerIdClaim == null)
            {
                return BadRequest("Borrower ID not found in token");
            }

            var borrower_id = borrowerIdClaim.Value; // Get the borrower_id from the claim
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

			var response = await _httpClient.GetAsync("https://localhost:7158/api/v1/repayment/GetRepaymentsByBorrowerId?borrower_id=" + borrower_id);
			var responseData = await response.Content.ReadAsStringAsync();

			if (response.IsSuccessStatusCode)
			{
				return Ok(responseData);
			}
			else
			{
				return BadRequest("Fetch failed");
			}
		}

	}
}
