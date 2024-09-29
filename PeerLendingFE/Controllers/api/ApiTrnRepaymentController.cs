using Microsoft.AspNetCore.Mvc;
using PeerLendingFE.DTO.Req;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PeerLendingFE.Controllers.api
{
    public class ApiTrnRepaymentController : Controller
    {
        private readonly HttpClient _httpClient;
        public ApiTrnRepaymentController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRepayment([FromBody] ReqCreateRepaymentDto reqCreateRepaymentDto)
        {
            if (reqCreateRepaymentDto == null)
            {
                return BadRequest("Invalid repayment data");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqCreateRepaymentDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://localhost:7158/api/v1/repayment/CreateRepayment", content);

            if (response.IsSuccessStatusCode)
            {
                var jsonData = await response.Content.ReadAsStringAsync();
                return Ok(jsonData);
            }
            else
            {
                return BadRequest("Failed to add repayment");
            }
        }
    }
}
