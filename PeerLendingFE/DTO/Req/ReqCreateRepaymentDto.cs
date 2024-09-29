namespace PeerLendingFE.DTO.Req
{
    public class ReqCreateRepaymentDto
    {
        public string loan_id {  get; set; }
        public decimal interest_rate { get; set; }
        public decimal amount { get; set; }
        public decimal duration { get; set; }
    }
}
