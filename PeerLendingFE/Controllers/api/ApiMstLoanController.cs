using Microsoft.AspNetCore.Mvc;
using PeerLendingFE.DTO.Req;
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

        [HttpGet]
        public async Task<IActionResult> GetLoans()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync("https://localhost:7158/api/v1/loan/LoanList");
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
