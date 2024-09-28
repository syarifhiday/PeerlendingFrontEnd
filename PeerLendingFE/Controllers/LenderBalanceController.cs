using Microsoft.AspNetCore.Mvc;

namespace PeerLendingFE.Controllers
{
    public class LenderBalanceController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
