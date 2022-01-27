import React from 'react';

const useForm = (initialState = {}, onSubmit) => {
  const [formData, setFormData] = React.useState(initialState);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(formData);
    setIsLoading(false);
  }
  return { formData, handleInputChange, handleSubmit, isLoading };
}

export default useForm;
