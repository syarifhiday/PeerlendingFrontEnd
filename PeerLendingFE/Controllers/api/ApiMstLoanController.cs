using Microsoft.AspNetCore.Mvc;
using PeerLendingFE.DTO.Req;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PeerLendingFE.Controllers.api
{

    public class ApiMstLoanController : Controller
    {
        private readonly HttpClient _httpClient;
        public ApiMstLoanController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

		[HttpPost]
		public async Task<IActionResult> AddLoan([FromBody] ReqCreateLoanDto reqCreateLoanDto)
		{
			if (reqCreateLoanDto == null)
			{
				return BadRequest("Invalid loan data");
			}

			var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
			_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

			var json = JsonSerializer.Serialize(reqCreateLoanDto);
			var content = new StringContent(json, Encoding.UTF8, "application/json");

			var response = await _httpClient.PostAsync("https://localhost:7158/api/v1/loan/NewLoan", content);

			if (response.IsSuccessStatusCode)
			{
				var jsonData = await response.Content.ReadAsStringAsync();
				return Ok(jsonData); 
			}
			else
			{
				return BadRequest("Failed to add loan");
			}
		}


		[HttpGet]
        public async Task<IActionResult> GetLoans()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync("https://localhost:7158/api/v1/loan/LoanList?status=requested");
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

        [HttpGet]
        public async Task<IActionResult> GetLoansByBorrowerId()
        {
            // Retrieve the token from the Authorization header
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

            var response = await _httpClient.GetAsync($"https://localhost:7158/api/v1/loan/RequestedLoanByBorrowerId?borrower_id={borrower_id}");
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

        [HttpPut]
        public async Task<IActionResult> ChangeLoanStatus(string id, [FromBody] ReqMstLoanStatusDto reqMstLoanStatusDto)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Loan ID cannot be null");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var json = JsonSerializer.Serialize(reqMstLoanStatusDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Send request to change loan status to 'funded'
            var response = await _httpClient.PutAsync($"https://localhost:7158/api/v1/loan/UpdateStatusLoan?Id={id}", content);

            if (response.IsSuccessStatusCode)
            {
                return Ok("Loan status changed successfully");
            }
            else
            {
                return BadRequest("Failed to change loan status");
            }
        }
    }
}
