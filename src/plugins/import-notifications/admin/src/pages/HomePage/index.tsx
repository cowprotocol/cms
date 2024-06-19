/*
 *
 * HomePage
 *
 */

import React, { useCallback, useRef, useState } from 'react';
import { useFetchClient } from '@strapi/helper-plugin';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 100px;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
`

const Form = styled.div`
  background: #fff;
  padding: 20px;
  width: 100%;
  text-align: center;
`

const Button = styled.button`
  background: #3a5f93;
  color: #fff;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
`

const Error = styled.div`
  background: #ffcece;
  color: #000000;
  text-align: center;
  width: 100%;
  padding: 20px 0;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
  }
`

const HomePage = () => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const {post} = useFetchClient();

  const uploadFile = useCallback(() => {
    const file = ref.current?.files?.[0]
    const formData = new FormData();

    if (!file) return

    formData.append('file', file);

    setIsLoading(true)
    setError(null)

    post('/import-notifications/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response: {data: {error?: string, status?: string}}) => {
      const data = response.data
      if (data.error) {
        setError(data.error)
        return
      }

      if (data.status === 'ok') {
        setError(null)
        alert('File is successfully uploaded')
      }
      if (ref.current) ref.current.value = ''
    }).catch((error: Error) => {
      console.error(error)
      setError(error.message || setError.toString())
    }).finally(() => {
      setIsLoading(false)
    })
  }, [post])

  return (
    <Wrapper>
      <Title>Upload CSV file with notifications</Title>
      <br/>
      {error && (
        <Error>
          <h3>Error</h3>
          <pre>{error}</pre>
        </Error>
      )}
      <Form>
        <input ref={ref} type="file" id="myFile" name="filename"/>
        <Button disabled={isLoading} onClick={uploadFile}>{isLoading ? 'Loading...' : 'Upload'}</Button>
      </Form>
    </Wrapper>
  );
};

export default HomePage;
