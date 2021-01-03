export const options = [
  { key: 'details', icon: '', text: 'Details', value: 'common', onClick:()=>{
    return 'details';
  } },
  { key: 'upgrade', icon: '', text: 'Upgrade', value: 'positive', onClick:()=>{
    console.log('upgrade')
    return 'upgrade';
  }  },
  { key: 'downgrade', icon: '', text: 'Downgrade', value: 'negative', onClick:()=>{
    console.log('downgrade')
    return 'downgrade';
  } }
];
