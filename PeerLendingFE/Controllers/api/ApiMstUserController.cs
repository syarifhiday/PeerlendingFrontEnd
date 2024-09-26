using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace PeerLendingFE.Controllers.api
{
	public class ApiMstUserController : Controller
	{
		private readonly HttpClient _httpClient;
		public ApiMstUserController(HttpClient httpClient)
		{
			_httpClient = httpClient;
		}

		[HttpGet]
		public async Task<IActionResult> GetAllUsers()
		{
			var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
			_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

			var response = await _httpClient.GetAsync("https://localhost:7158/api/v1/user/GetAllUsers");

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
