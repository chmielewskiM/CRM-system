import { observable, action, computed, configure, runInAction } from 'mobx';
import agent from '../api/agent';
import { IMaterial } from '../models/material';
import { RootStore } from './rootStore';

configure({ enforceActions: 'always' });

export default class StockStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable materials: IMaterial[] = [];

  @observable selectedMaterial: IMaterial | undefined;

  @observable loadingInitial = false;

  @observable showMaterialForm = false;

  @observable submitting = false;

  @observable materialRegistry = new Map();

  @observable selected: string | undefined = undefined;

  @observable selectedValue = '';

  @observable rr = false;

  @action render() {
    this.rr = !this.rr;
  }

  @computed get materialsByName() {
    return Array.from(this.materialRegistry.values());
    //   .slice(0)
    //   .sort((a, b) => Date.parse(b.dateAdded) - Date.parse(a.dateAdded));
  }

  @action loadMaterials = async () => {
    this.loadingInitial = true;
    try {
      const materials = await agent.Materials.list();
      runInAction('Loading materials', () => {
        materials.forEach((material) => {
          this.materialRegistry.set(material.id, material);
        });
        this.loadingInitial = false;
      });
      this.render();
    } catch (error) {
      runInAction('Loading error', () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action selectMaterial = (id: string) => {
    if (id !== '') {
      this.selectedMaterial = this.materialRegistry.get(id);
      this.selected = '1';
      this.render();
    } else {
      this.selectedMaterial = undefined;
      this.render();
    }
  };

  @action addMaterialForm = () => {
    this.selectedMaterial = undefined;
    this.showMaterialForm = true;
    this.render();
  };

  @action editMaterialForm = (id: string) => {
    this.selectedMaterial = this.materialRegistry.get(id);
    this.showMaterialForm = true;
    this.render();
  };

  @action setShowMaterialForm = (show: boolean) => {
    this.showMaterialForm = show;
    this.render();
  };

  @action updateFormSelect = async (selection: string) => {
    this.selectedValue = selection;
    return this.selectedValue;
  };

  @action addMaterial = async (material: IMaterial) => {
    this.submitting = true;
    try {
      await agent.Materials.add(material);
      runInAction('Loading materials', () => {
        this.materialRegistry.set(material.id, material);
        this.showMaterialForm = false;
        this.submitting = false;
      });
      this.render();
    } catch (error) {
      runInAction('Loading materials', () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action editMaterial = async (material: IMaterial) => {
    this.submitting = true;
    if (this.selectedMaterial !== material) {
      try {
        await agent.Materials.update(material);
        runInAction('Loading materials', () => {
          this.materialRegistry.set(material.id, material);
          this.selectedMaterial = material;
          this.showMaterialForm = false;
          this.submitting = false;
        });
        this.render();
      } catch (error) {
        runInAction('Loading materials', () => {
          this.submitting = false;
        });
        console.log(error);
      }
    } else {
      this.showMaterialForm = false;
      this.submitting = false;
      this.render();
    }
  };

  @action deleteMaterial = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Materials.delete(id);
      runInAction('Deleting material', () => {
        this.materialRegistry.delete(this.selectedMaterial!.id);
        this.selectedMaterial = undefined;
        this.submitting = false;
      });
      this.render();
    } catch (error) {
      runInAction('Deleting material', () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };
}
