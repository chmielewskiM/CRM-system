using Application.Contacts;
using Application.Leads.ViewModels;
using Application.Orders;
using AutoMapper;
using Domain;

namespace Application.Leads
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Lead, LeadViewModel>();
            CreateMap<Contact, LeadViewModel>();
            CreateMap<Order, LeadViewModel>();
            CreateMap<ContactViewModel, Contact>();
            // CreateMap<Contact, ContactDTO>()
            // .ForMember(c =>c.Status, d => d.MapFrom(s=>s.Status));
            // CreateMap<Order, OrderDTO>()
            // .ForMember(c => c.OrderNumber, d => d.MapFrom(s=>s.OrderNumber));
        }
    }
}