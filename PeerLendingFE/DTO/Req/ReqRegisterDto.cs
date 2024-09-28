namespace PeerLendingFE.DTO.Req
{
	public class ReqRegisterDto
	{
		public string name { get; set; }
		public string email { get; set; }
		public string role { get; set; }
		public decimal balance { get; set; } = 0; // Default 0
		public string password { get; set; } = "Password1"; // Default password
	}
}
