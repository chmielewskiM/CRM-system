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
            .ForMember(d => d.Username, o => o.MapFrom(s => s.User.UserName))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName));
        }
    }
}