import Swal from 'sweetalert2';

export const showSuccessToast = (message: string) => {
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

export const showErrorToast = (message: string) => {
  Swal.fire({
    icon: 'error',
    title: 'Error!',
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });
};

export const showWarningToast = (message: string) => {
  Swal.fire({
    icon: 'warning',
    title: 'Warning!',
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

export const showConfirmDialog = (title: string, text: string): Promise<boolean> => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, proceed!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    return result.isConfirmed;
  });
};