using Microsoft.AspNetCore.Mvc;
using PeerLendingFE.DTO.Req;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PeerLendingFE.Controllers.api
{
    public class ApiTrnFundingController : Controller
    {
        private readonly HttpClient _httpClient;
        public ApiTrnFundingController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpPost]
        public async Task<IActionResult> CreateFunding([FromBody] ReqCreateFundingDto reqCreateFundingDto)
        {
            if (reqCreateFundingDto == null)
            {
                return BadRequest("Invalid funding data");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqCreateFundingDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://localhost:7158/api/v1/funding/CreateFunding", content);

            if (response.IsSuccessStatusCode)
            {
                var jsonData = await response.Content.ReadAsStringAsync();
                return Ok(jsonData); 
            }
            else
            {
                return BadRequest("Failed to add funding");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetFundings(string lender_id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync("https://localhost:7158/api/v1/funding/FundingList?lender_id="+lender_id);
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
