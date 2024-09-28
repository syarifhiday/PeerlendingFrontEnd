using Microsoft.AspNetCore.Mvc;
using PeerLendingFE.DTO.Req;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PeerLendingFE.Controllers.api
{
    public class ApiMstUserController : Controller
	{
		private readonly HttpClient _httpClient;
		public ApiMstUserController(HttpClient httpClient)
		{
			_httpClient = httpClient;
		}

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

		[HttpGet]
		public async Task<IActionResult> GetUserById(string id)
		{
			if (string.IsNullOrEmpty(id))
			{
				return BadRequest("User ID cannot be null");
			}

			var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
			_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

			var response = await _httpClient.GetAsync("https://localhost:7158/api/v1/user/DetailUser?id=" + id);

			if(response.IsSuccessStatusCode)
			{
				var jsonData = await response.Content.ReadAsStringAsync();
				return Ok(jsonData);
			}
			else
			{
				return BadRequest("Failed to fetch user in controller");
			}
		}

		[HttpPost]
		public async Task<IActionResult> AddUser([FromBody] ReqRegisterDto reqRegisterDto)
		{
			if (reqRegisterDto == null)
			{
				return BadRequest("Invalid user data");
			}

			// Extract the token from the request header
			var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
			_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

			// Serialize the user data to JSON
			var json = JsonSerializer.Serialize(reqRegisterDto);
			var content = new StringContent(json, Encoding.UTF8, "application/json");

			// Send the request to the API for adding a new user
			var response = await _httpClient.PostAsync("https://localhost:7158/api/v1/user/Register", content);

			if (response.IsSuccessStatusCode)
			{
				var jsonData = await response.Content.ReadAsStringAsync();
				return Ok(jsonData); // Return the added user data or success message
			}
			else
			{
				return BadRequest("Failed to add user");
			}
		}


		[HttpPut]
		public async Task<IActionResult> UpdateUser(string id, [FromBody] ReqMstUserDto reqMstUserDto)
		{
			if(reqMstUserDto == null)
			{
				return BadRequest("Invalid user data");
			}

			var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
			_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
			var json = JsonSerializer.Serialize(reqMstUserDto);
			var content = new StringContent(json, Encoding.UTF8, "application/json");

			var response = await _httpClient.PutAsync($"https://localhost:7158/api/v1/user/UpdateUserProfile?id=" + id, content);

			if(response.IsSuccessStatusCode)
			{
				var jsonData = await response.Content.ReadAsStringAsync();
				return Ok(jsonData);
			}
			else
			{
				return BadRequest("Failed to update user");
			}
		}


		[HttpDelete]
		public async Task<IActionResult> DeleteUser(string id)
		{
			if (string.IsNullOrEmpty(id))
			{
				return BadRequest("Invalid user ID");
			}

			// Extract token from the Authorization header
			var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
			_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

			// Send DELETE request to the API
			var response = await _httpClient.DeleteAsync($"https://localhost:7158/api/v1/user/Delete?id=" + id);

			if (response.IsSuccessStatusCode)
			{
				var jsonData = await response.Content.ReadAsStringAsync();
				return Ok(jsonData); // Return the response from the API
			}
			else
			{
				return BadRequest("Failed to delete user");
			}
		}

	}
}
