using Microsoft.AspNetCore.Mvc;

namespace PeerLendingFE.Controllers
{
    public class BorrowerLoanController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
