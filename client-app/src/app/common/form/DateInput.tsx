import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import { observer } from 'mobx-react-lite';

export interface IProps
  extends FieldRenderProps<Date, HTMLElement>,
    FormFieldProps {
  minDate: Date;
}

const DateInput: React.FC<IProps> = ({
  input,
  width,
  placeholder,
  meta: { touched, error },
  date = false,
  time = false,
  minDate,
}) => {
  return (
    <Form.Field error={touched && !!error} width={width} mindate={minDate}>
      <DateTimePicker
        placeholder={placeholder}
        value={input.value || undefined}
        onChange={input.onChange}
        onBlur={input.onBlur}
        onKeyDown={(e) => e.preventDefault()}
        date={date}
        time={time}
        min={minDate}
      ></DateTimePicker>
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default observer(DateInput);
