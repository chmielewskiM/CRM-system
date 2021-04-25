namespace Application.Operations.ViewModels
{
    public class SourcesViewModel
    {
        public int Web { get; set; }
        public int SocialMedia { get; set; }
        public int Flyers { get; set; }
        public int Commercial { get; set; }
        public int FormerClient { get; set; }

        public SourcesViewModel(int web, int socialMedia, int flyers, int commercial, int formerClient)
        {
            this.FormerClient = formerClient;
            this.Commercial = commercial;
            this.Flyers = flyers;
            this.SocialMedia = socialMedia;
            this.Web = web;
        }
    }
}