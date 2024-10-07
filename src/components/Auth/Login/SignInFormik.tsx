import { Form, Formik } from 'formik';
import { FormField } from '@/components/UI/CustomInput/CustomInput';
import { validationSchemaSignIn } from '../../../validation/validationSignIn';
import s from './signIn.module.scss';
import Button from '@/components/UI/Button/Button';
import Loader from '@/components/UI/Loader/Loader';
import useSignInFormik from '@/hooks/useSignInFormik';
import { CustomError } from '@/utils/types/customError';
import Error from '@/app/sign-in/error';
import DynamicForm from '@/components/UI/DynamicForm/DynamicForm';

const SignInFormik = () => {
  const {
    handleSubmit,
    togglePasswordVisibility,
    isLoading,
    showPassword,
    backendError,
    handleChange,
    error,
    isError,
  } = useSignInFormik();

  // функція, яка окремо обробляє велику умову на кнопці submit
  const getButtonClass = ({
    isLoading,
    isValid,
    touched,
    errors,
    backendError,
  }: {
    isLoading: boolean;
    isValid: boolean;
    touched: any;
    errors: any;
    backendError: string | null;
  }): string => {
    if (isLoading || isValid) {
      return s.valid;
    }

    if (
      !touched.email ||
      errors.email ||
      !touched.password ||
      errors.password
    ) {
      return '';
    }

    if (
      !touched.email ||
      errors.email ||
      !touched.password ||
      errors.password ||
      backendError
    ) {
      return s.invalid;
    }

    return s.valid;
  };

  return (
    <>
      {isError && error && (
        <Error
          error={{
            status: (error as CustomError).status,
            data: (error as CustomError).data,
          }}
          reset={() => window.location.reload()}
        />
      )}

      {/* Wrap the Formik logic using DynamicForm */}
      <DynamicForm
        initialValues={{ email: '', password: '', rememberMe: false }}
        validationSchema={validationSchemaSignIn}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          touched,
          dirty,
          handleChange: formikHandleChange,
          isValid,
        }) => (
          <Form className={s.form}>
            <FormField
              name={'email'}
              label={'Email'}
              type={'email'}
              touched={touched}
              errors={errors}
              backendError={backendError}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                formikHandleChange(e);
                handleChange();
              }}
            />
            <FormField
              name={'password'}
              label={'Пароль'}
              type={'password'}
              touched={touched}
              errors={errors}
              backendError={backendError}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                formikHandleChange(e);
                handleChange();
              }}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              isThisPassword={true}
            />

            {backendError && (
              <div className={s.error__backend}>{backendError}</div>
            )}

            <Button
              className={`${s.styledBtn} ${getButtonClass({
                isLoading,
                isValid,
                touched,
                errors,
                backendError,
              })}`}
              type="submit"
              isDisabled={!dirty || isLoading}
            >
              {isLoading ? (
                <>
                  Увійти
                  <Loader />
                </>
              ) : (
                'Увійти'
              )}
            </Button>
          </Form>
        )}
      </DynamicForm>
    </>
  );
};

export default SignInFormik;
