using Application.Contacts;
using AutoMapper;
using Domain;

namespace Application.Operations
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Operation, OperationDTO>();
            CreateMap<UserOperation, UserAccessDTO>()
            .ForMember(d => d.Username, o => o.MapFrom(s => s.User.UserName))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
            .ForMember(d => d.Level, o => o.MapFrom(s => s.User.Level));
        }
    }
}