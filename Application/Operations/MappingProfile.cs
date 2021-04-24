using Application.Operations.ViewModels;
using AutoMapper;
using Domain;

namespace Application.Operations
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Operation, OperationViewModel>();
            CreateMap<UserOperation, OperationDoneByViewModel>()
            .ForMember(d => d.Username, o => o.MapFrom(s => s.User.UserName))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName));
        }
    }
}