namespace PeerLendingFE.DTO.Req
{
	public class ReqCreateLoanDto
	{
		public string borrowerId {  get; set; }
		public decimal amount {  get; set; }
		public decimal interestRate {  get; set; }
		public decimal duration { get; set; }
	}
}
