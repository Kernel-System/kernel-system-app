import React from 'react';
import { message } from 'antd';
import { useStoreState } from 'easy-peasy';

import { insertItems as insertRMA } from 'api/compras/rmas';
import { getNowDBFormat } from 'utils/functions';

import RMAForm from 'components/forms/RMAForm';
import Header from 'components/UI/HeadingBack';

const Index = () => {
  const token = useStoreState((state) => state.user.token.access_token);

  const insertarRMA = async (rma) => {
    let id = -1;
    await insertRMA(rma, token)
      .then((result) => {
        if (result.status === 200) {
          id = result.data.data.id;
        }
      })
      .catch((error) => {
        if (
          error.response.data.errors[0].message.includes('has to be unique')
        ) {
          id = 0;
        }
      });
    return id;
  };

  const insertItem = async (rma) => {
    let success = false;
    const hide0 = message.loading('Registrando RMA', 0);
    const newRMA = {
      ...rma,
    };
    console.log(newRMA);
    const id = await insertarRMA(newRMA);
    hide0();
    if (id > 0) {
      message.success('El RMA ha sido registrada exitosamente', 2);
      success = true;
    } else {
      message.error('Fallo al intentar registrar los datos del RMA', 2.5);
    }

    return success;
  };

  return (
    <>
      <Header title='Registrar RMA' />
      <RMAForm
        datosRMA={{
          fecha: getNowDBFormat(),
        }}
        submitText='REGISTRAR RMA'
        cleanOnSubmit
        onSubmit={insertItem}
      ></RMAForm>
    </>
  );
};

export default Index;
