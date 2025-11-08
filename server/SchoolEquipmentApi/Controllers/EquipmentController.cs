using Microsoft.AspNetCore.Mvc;
using SchoolEquipmentApi.Models;
using SchoolEquipmentApi.Services;

namespace SchoolEquipmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentController : ControllerBase
    {
        private readonly IEquipmentService _equipmentService;

        public EquipmentController(IEquipmentService equipmentService)
        {
            _equipmentService = equipmentService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Equipment>>> GetAll()
        {
            var equipment = await _equipmentService.GetAllAsync();
            return Ok(equipment);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Equipment>> GetById(string id)
        {
            var equipment = await _equipmentService.GetByIdAsync(id);
            if (equipment == null)
            {
                return NotFound();
            }
            return Ok(equipment);
        }

        [HttpPost]
        public async Task<ActionResult<Equipment>> Add([FromBody] Equipment equipment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdEquipment = await _equipmentService.CreateAsync(equipment);
            return CreatedAtAction(nameof(GetById), new { id = createdEquipment.Id }, createdEquipment);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Equipment>> Update(string id, [FromBody] Equipment updatedEquipment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingEquipment = await _equipmentService.GetByIdAsync(id);
            if (existingEquipment == null)
            {
                return NotFound();
            }

            updatedEquipment.Id = id;
            updatedEquipment.CreatedAt = existingEquipment.CreatedAt; // Preserve creation date
            await _equipmentService.UpdateAsync(id, updatedEquipment);
            
            return Ok(updatedEquipment);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var equipment = await _equipmentService.GetByIdAsync(id);
            if (equipment == null)
            {
                return NotFound();
            }

            await _equipmentService.DeleteAsync(id);
            return NoContent();
        }
    }
}
