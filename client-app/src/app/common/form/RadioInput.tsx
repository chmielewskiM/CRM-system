import React, { useContext } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../stores/rootStore';
export interface IProps
  extends FieldRenderProps<boolean, HTMLElement>,
    FormFieldProps {}

const RadioInput: React.FC<IProps> = ({
  input,
  width,
  type,
  placeholder,
  meta: { touched, error },
  control,
}) => {
  const rootStore = useContext(RootStoreContext);
  const { toggleSelect } = rootStore.orderStore;
  return (
    <Form.Field error={touched && !!error} type={type} width={width}>
      <input
        type="radio"
        checked={input.value}
        onChange={
          (input.onChange = (e) => {
            toggleSelect(input.value);
          })
        }
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default observer(RadioInput);
