using Application.DelegatedTasks;
using AutoMapper;
using Domain;

namespace Application.DelegationTasks
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<DelegatedTask, DelegatedTaskDTO>();
            CreateMap<UserTask, UserAccessDTO>()
            .ForMember(d => d.CreatedByUsername, o => o.MapFrom(s => s.CreatedBy.UserName))
            .ForMember(d => d.CreatedBy, o => o.MapFrom(s => s.CreatedBy.DisplayName))
            .ForMember(d => d.SharedWithUsername, o => o.MapFrom(s => s.SharedWith.UserName))
            .ForMember(d => d.SharedWith, o => o.MapFrom(s => s.SharedWith.DisplayName));
        }
    }
}