using Microsoft.AspNetCore.Mvc;
using SchoolEquipmentApi.Models;
using SchoolEquipmentApi.Services;

namespace SchoolEquipmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestsController : ControllerBase
    {
        private readonly IRequestService _requestService;

        public RequestsController(IRequestService requestService)
        {
            _requestService = requestService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BorrowRequest>>> GetAll()
        {
            var requests = await _requestService.GetAllAsync();
            return Ok(requests);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BorrowRequest>> GetById(string id)
        {
            var request = await _requestService.GetByIdAsync(id);
            if (request == null)
            {
                return NotFound();
            }
            return Ok(request);
        }

        [HttpPost]
        public async Task<ActionResult<BorrowRequest>> Add([FromBody] BorrowRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Basic validation - in production, you'd want more sophisticated overlap checking
            request.Status = "pending";
            var createdRequest = await _requestService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = createdRequest.Id }, createdRequest);
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult<BorrowRequest>> UpdateStatus(string id, [FromBody] UpdateStatusRequest updateRequest)
        {
            var request = await _requestService.GetByIdAsync(id);
            if (request == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(updateRequest.Status))
            {
                return BadRequest("Status is required");
            }

            var validStatuses = new[] { "pending", "approved", "rejected", "returned" };
            if (!validStatuses.Contains(updateRequest.Status))
            {
                return BadRequest("Invalid status");
            }

            request.Status = updateRequest.Status;
            await _requestService.UpdateAsync(id, request);

            return Ok(request);
        }

        [HttpGet("user/{userEmail}")]
        public async Task<ActionResult<IEnumerable<BorrowRequest>>> GetByUser(string userEmail)
        {
            var userRequests = await _requestService.GetByUserAsync(userEmail);
            return Ok(userRequests);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var request = await _requestService.GetByIdAsync(id);
            if (request == null)
            {
                return NotFound();
            }

            await _requestService.DeleteAsync(id);
            return NoContent();
        }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}
