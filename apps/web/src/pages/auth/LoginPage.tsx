import React, { useState } from 'react';
import { Card, Form, Button, Page } from '@shopify/polaris';
import { useForm, SubmitHandler } from 'react-hook-form';
import TextField from '../../components/TextField/TextField';
import { fetcher } from '../../libs/fetcher.lib';
// import { USER_NOT_FOUND } from 'shared';

type Inputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data: unknown) => {
    fetcher
      .post('auth/login', data)
      .then(() => {
        window.location.href = '/';
      })
      .catch((err) => {
        switch (err.response.data.message) {
          case 'HTTP_USER_NOT_FOUND':
            setError('email', { message: 'user not found', type: 'value' });
            break;
          case 'INCORRECT_PASSWORD':
            setError('password', {
              message: 'password is not correct',
              type: 'value',
            });
            break;
          default:
            console.log(err);
        }
      });
  };

  return (
    <Page>
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <Card>
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Page>
              <div style={{ marginBottom: 12 }}>
                <p>Email</p>
                <div style={{ margin: '5px 0' }}>
                  <TextField
                    label="Email"
                    type="email"
                    error={errors.email}
                    autoComplete="false"
                    placeholder="email"
                    {...register('email', {
                      required: 'Email Address is required',
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="Polaris-InlineError">{errors.email.message}</p>
                )}
                <p>Password</p>
                <div style={{ margin: '5px 0' }}>
                  <TextField
                    label="Password"
                    type="password"
                    autoComplete="false"
                    placeholder="password"
                    error={errors.password}
                    {...register('password', {
                      required: 'Password is required',
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="Polaris-InlineError">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button submit variant="primary">
                Log in
              </Button>
            </Page>
          </Form>
        </Card>
      </div>
    </Page>
  );
};

export default LoginPage;
