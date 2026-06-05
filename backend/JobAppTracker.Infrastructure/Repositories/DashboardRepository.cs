using System;
using System.Collections.Generic;
using System.Net.NetworkInformation;
using System.Text;
using JobAppTracker.Application.Features.Dashboard.Dtos;
using JobAppTracker.Application.Interfaces.Repositories;
using JobAppTracker.Domain.Enums;
using JobAppTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobAppTracker.Infrastructure.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly AppDbContext _appContext;

        public DashboardRepository(AppDbContext appContext)
        {
            _appContext = appContext;
        }

        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync(string UserId)
        {
            var jobApplications = await _appContext
                .JobApplications.Where(j => j.UserId == Guid.Parse(UserId))
                .ToListAsync();
            var interviews = await _appContext
                .Interviews.Include(i => i.JobApplication)
                .Where(i => i.UserId == Guid.Parse(UserId))
                .ToListAsync();
            int TotalApplications = jobApplications.Count;
            int ThisWeekApplications = jobApplications.Count(a =>
                a.AppliedAt >= DateTime.UtcNow.AddDays(-7)
            );

            return new DashboardSummaryDto
            {
                TotalApplications = TotalApplications,
                ThisWeekApplications = ThisWeekApplications,
                ByStatus = new StatusBreakdownDto
                {
                    Applied = jobApplications.Count(a => a.Status == JobAppStatus.Submitted),
                    Interviewing = jobApplications.Count(a =>
                        a.Status == JobAppStatus.InterviewScheduled
                    ),
                    Offered = jobApplications.Count(a => a.Status == JobAppStatus.UnderReview),
                    Rejected = jobApplications.Count(a => a.Status == JobAppStatus.Rejected),
                    Withdrawn = jobApplications.Count(a => a.Status == JobAppStatus.Withdrawn),
                },

                UpcomingInterviews = interviews
                    .Where(a => a.InterviewDate >= DateTime.UtcNow)
                    .OrderBy(a => a.InterviewDate)
                    .Take(5)
                    .Select(a => new UpcomingInterviewDto
                    {
                        Id = a.Id,
                        Company = a.JobApplication.CompanyName,
                        Position = a.JobApplication.Title,
                        InterviewDate = a.InterviewDate,
                    })
                    .ToList(),
                RecentApplications = jobApplications
                    .OrderByDescending(a => a.AppliedAt)
                    .Take(5)
                    .Select(a => new RecentApplicationDto
                    {
                        JobAppId = a.Id,
                        Company = a.CompanyName,
                        Position = a.Title,
                        AppliedDate = a.AppliedAt,
                        Status = a.Status.ToString(),
                    })
                    .ToList(),
            };
        }
    }
}
