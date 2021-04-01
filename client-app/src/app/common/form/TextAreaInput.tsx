import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

export interface IProps
  extends FieldRenderProps<string, HTMLElement>,
    FormFieldProps {}

const TextAreaInput: React.FC<IProps> = ({
  input,
  width,
  rows,
  placeholder,
  meta: { touched, error },
  className,
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <textarea
        rows={rows}
        {...input}
        placeholder={placeholder}
        className={className}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default observer(TextAreaInput);
