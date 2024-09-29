namespace PeerLendingFE.DTO.Req
{
    public class ReqCreateFundingDto
    {
        public string loan_id {  get; set; }
        public string lender_id { get; set; }
        public decimal amount { get; set; }
    }
}
