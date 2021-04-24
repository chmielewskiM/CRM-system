using Application.Contacts.ViewModels;
using AutoMapper;
using Domain;

namespace Application.Contacts
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Contact, ContactViewModel>();
            CreateMap<UserContact, UserAccessViewModel>()
            .ForMember(d => d.Username, o => o.MapFrom(s => s.User.UserName))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
            .ForMember(d => d.Level, o => o.MapFrom(s => s.User.Level));
        }
    }
}