export interface IMaterial {
    id: string;
    name: string;
    storehouse: string;
    available: ConstrainDouble;
    deployed: ConstrainDouble;
    ordered: ConstrainDouble;
    required: ConstrainDouble;
}
  