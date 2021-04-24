using Application.Users.ViewModels;
using AutoMapper;
using Domain;

namespace Application.Users
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserViewModel>();
        }
    }
}