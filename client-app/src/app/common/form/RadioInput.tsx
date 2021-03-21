import React, { Fragment, useContext } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../stores/rootStore';
export interface IProps extends FieldRenderProps<boolean, HTMLElement>, FormFieldProps {
  func:(value: boolean)=>void;
}

const RadioInput: React.FC<IProps> = ({
  input,
  width,
  type,
  placeholder,
  meta: { touched, error },
  control,
  func,
  label,
  className
}) => {
  const rootStore = useContext(RootStoreContext);
  const { toggleSelect } = rootStore.orderStore;
  return (
    <Fragment>
      <Label className='radio-label' content={label}/>
    <Form.Field error={touched && !!error} type={type} width={width} className={className}>
      <input
        type="radio"
        checked={input.value}
        onChange={
          (input.onChange = (e) => {
            func(input.value);
          })
        }
        
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
    </Fragment>
  );
};

export default observer(RadioInput);
