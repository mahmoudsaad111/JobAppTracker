using System.Security.Claims;
using JobAppTracker.Application.Common.Responses;
using JobAppTracker.Application.Features.Documents.Commands;
using JobAppTracker.Application.Features.Documents.Dtos;
using JobAppTracker.Application.Features.Documents.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobAppTracker.API.Controllers
{
    [ApiController]
    [Route("api/Document")]
    [Authorize]
    public class DocumentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DocumentsController(IMediator mediator) => _mediator = mediator;

        // ── GET /api/documents ────────────────────────────────────────────────
        [HttpGet]
        public async Task<IActionResult> GetUserDocuments()
        {
            var docs = await _mediator.Send(new GetUserDocumentsQuery());
            return Ok(
                ApiResponse<GetUserDocumentsDto>.SuccessResult(
                    docs,
                    "Documents retrieved successfully."
                )
            );
        }

        // ── POST /api/documents ───────────────────────────────────────────────
        [HttpPost]
        [RequestSizeLimit(10 * 1024 * 1024)]
        public async Task<IActionResult> UploadDocument(
            [FromForm] IFormFile file,
            [FromForm] string type = "Other"
        )
        {
            var document = await _mediator.Send(
                new UploadDocumentCommand
                {
                    File = file, // ← pass the whole file
                    Type = type,
                }
            );
            return Ok(
                ApiResponse<UploadDocumentDto>.SuccessResult(
                    document,
                    "Document uploaded successfully."
                )
            );
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocument(string id) { 
          var result = await _mediator.Send(new DeleteDocumentCommand { DocumentId = Guid.Parse(id) });
          return Ok(ApiResponse<DeleteDocumentDto>.SuccessResult(
            result,
            "Document deleted successfully."
          ));
        }
    }
}
