using Microsoft.AspNetCore.Mvc;

namespace PeerLendingFE.Controllers
{
    public class MstLoanController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
