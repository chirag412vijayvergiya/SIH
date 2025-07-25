import { useState } from 'react';
import Button from '../../../ui/Button';
import { useUpdateUserData } from './useUpdateUserData';

function Updateuserdata({
  currentFullName,
  currentEmail,
  currentRole,
  currentGender,
  currentPhoto,
}) {
  const { updateUser, isUpdating } = useUpdateUserData();
  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [Gender, setGender] = useState(currentGender);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    // console.log(avatar, Gender, fullName);

    updateUser(
      { fullName, Gender, photo: avatar },
      {
        onSuccess: () => {
          console.log('User account successfully updated', avatar);
          e.target.reset();
        },
      },
    );
  }

  function handleCancel() {
    setFullName(currentFullName);
    setAvatar(null);
    setGender(currentGender);
  }

  // console.log(
  //   currentPhoto,
  //   currentFullName,
  //   currentEmail,
  //   currentRole,
  //   currentGender,
  // );
  return (
    fullName !== undefined && (
      <form
        className="m-9 ml-10 flex flex-col font-sans md:flex-row"
        onSubmit={handleSubmit}
      >
        <div className="ml-11 h-full w-full  md:ml-0 md:h-10 md:w-1/3">
          <span className="relative my-4 ml-10 flex shrink-0 overflow-hidden rounded-full hover:brightness-90 md:my-6">
            <img
              src={preview || currentPhoto}
              alt={`Avatar of ${currentFullName}`}
              className="aspect-square items-center rounded-full border object-cover md:mx-0"
              height="115"
              width="115"
            />
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUpdating}
            className="ml-6 mt-1 w-[9rem] cursor-pointer rounded-sm bg-brand-600 px-2 py-2  text-sm tracking-wider text-brand-50 transition duration-200 hover:bg-brand-700 md:ml-0 md:mt-2 md:w-[12.9rem]"
          />
        </div>
        <div className="mt-4 flex w-full flex-col gap-y-3 md:mt-0 md:w-2/3">
          <div className="flex  flex-row gap-6">
            <div className="flex flex-1 flex-col gap-1">
              <label className=" text-base font-medium tracking-wider text-stone-900 dark:text-stone-300 md:text-lg">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue={fullName}
                  id="fullName"
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isUpdating}
                  className="w-full  rounded-sm border border-grey-300 bg-grey-0 p-2 pl-3 text-sm tracking-normal shadow-sm dark:border-slate-700 dark:bg-slate-800  dark:text-gray-100 md:w-[12.7rem] md:text-base md:tracking-wider"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label className=" text-base font-medium tracking-wider text-stone-900 dark:text-stone-300">
                Email
              </label>
              <div className="">
                <input
                  type="text"
                  defaultValue={currentEmail}
                  disabled
                  className="w-full  rounded-sm border border-grey-300 bg-grey-0 p-2 pl-3 text-sm tracking-normal opacity-50 shadow-sm dark:border-slate-700 dark:bg-slate-800  dark:text-gray-100 md:w-[12.7rem] md:text-base md:tracking-wider"
                />
              </div>
            </div>
          </div>
          <div className="flex  flex-row gap-6">
            <div className="flex flex-1 flex-col gap-1">
              <label className=" text-base font-medium tracking-wider text-stone-900 dark:text-stone-300">
                Role
              </label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue={currentRole}
                  id="Role"
                  disabled
                  className=" w-full rounded-sm border border-grey-300 bg-grey-0 p-2 pl-3 text-sm tracking-wider opacity-50  shadow-sm  dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 md:w-[12.7rem] md:text-base"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-base font-medium tracking-wider text-stone-900 dark:text-stone-300">
                Gender
              </label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue={Gender}
                  id="Gender"
                  onChange={(e) => setGender(e.target.value)}
                  disabled={isUpdating}
                  className="w-full rounded-sm border border-grey-300 bg-grey-0 p-2 pl-3 text-sm tracking-wider shadow-sm  dark:border-slate-700  dark:bg-slate-800 dark:text-gray-100 md:w-[12.7rem] md:text-base "
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-5 ">
            <Button
              type="reset"
              variation="secondary"
              disabled={isUpdating}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button disabled={isUpdating} type="update">
              Update account
            </Button>
          </div>
        </div>
      </form>
    )
  );
}

export default Updateuserdata;
