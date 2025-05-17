// ... [import statements unchanged]

const MyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [userId, setUserId] = useState("");
  const [isChangePasswordFormShow, setisChangePasswordFormShow] = useState(false);
  const [phone, setPhone] = useState('');

  const [formFields, setFormsFields] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  const [changePassword, setChangePassword] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token === null) {
      history("/");
    }
  }, [context?.isLogin]);

  useEffect(() => {
    if (context?.userData?._id) {
      setUserId(context.userData._id);
      setTimeout(() => {
        setFormsFields({
          name: context?.userData?.name || '',
          email: context?.userData?.email || '',
          mobile: context?.userData?.mobile || ''
        });
        setPhone(context?.userData?.mobile || '');
        setChangePassword((prev) => ({
          ...prev,
          email: context?.userData?.email || ''
        }));
      }, 200);
    }
  }, [context?.userData]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    setFormsFields((prev) => ({
      ...prev,
      [name]: value
    }));

    setChangePassword((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const valideValue = Object.values(formFields).every(el => el);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, email, mobile } = formFields;

    if (!name || !email || !mobile) {
      context.alertBox("error", "Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    editData(`/api/user/${userId}`, formFields, { withCredentials: true }).then((res) => {
      setIsLoading(false);
      if (res?.error !== true) {
        context.alertBox("success", res?.data?.message);
      } else {
        context.alertBox("error", res?.data?.message);
      }
    });
  };

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    setIsLoading2(true);

    const { oldPassword, newPassword, confirmPassword } = changePassword;

    if (!oldPassword || !newPassword || !confirmPassword) {
      context.alertBox("error", "Please fill all password fields");
      setIsLoading2(false);
      return;
    }

    if (confirmPassword !== newPassword) {
      context.alertBox("error", "Password and Confirm Password do not match");
      setIsLoading2(false);
      return;
    }

    postData(`/api/user/reset-password`, changePassword, { withCredentials: true }).then((res) => {
      setIsLoading2(false);
      if (res?.error !== true) {
        context.alertBox("success", res?.message);
      } else {
        context.alertBox("error", res?.message);
      }
    });
  };

  return (
    <section className="py-3 lg:py-10 w-full">
      <div className="container flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-[20%]">
          <AccountSidebar />
        </div>

        <div className="col2 w-full lg:w-[50%]">
          <div className="card bg-white p-5 shadow-md rounded-md mb-5">
            <div className="flex items-center pb-3">
              <h2 className="pb-0">My Profile</h2>
              <Button className="!ml-auto" onClick={() => setisChangePasswordFormShow(!isChangePasswordFormShow)}>
                Change Password
              </Button>
            </div>
            <hr />

            <form className="mt-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ">
                <div className="col">
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    size="small"
                    className="w-full"
                    name="name"
                    value={formFields.name || ""}
                    disabled={isLoading}
                    onChange={onChangeInput}
                  />
                </div>

                <div className="col">
                  <TextField
                    type="email"
                    label="Email"
                    variant="outlined"
                    size="small"
                    className="w-full"
                    name="email"
                    value={formFields.email || ""}
                    disabled={true}
                    onChange={onChangeInput}
                  />
                </div>

                <div className="col">
                  <PhoneInput
                    defaultCountry="in"
                    value={phone}
                    disabled={isLoading}
                    onChange={(phone) => {
                      setPhone(phone);
                      setFormsFields(prev => ({
                        ...prev,
                        mobile: phone
                      }));
                    }}
                  />
                </div>
              </div>

              <br />

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={!valideValue} className="btn-org btn-sm w-[150px]">
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : 'Update Profile'}
                </Button>
              </div>
            </form>
          </div>

          <Collapse isOpened={isChangePasswordFormShow}>
            <div className="card bg-white p-5 shadow-md rounded-md">
              <div className="flex items-center pb-3">
                <h2 className="pb-0">Change Password</h2>
              </div>
              <hr />

              <form className="mt-8" onSubmit={handleSubmitChangePassword}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {
                    context?.userData?.signUpWithGoogle === false &&
                    <div className="col">
                      <TextField
                        label="Old Password"
                        variant="outlined"
                        size="small"
                        className="w-full"
                        name="oldPassword"
                        type="password"
                        value={changePassword.oldPassword || ""}
                        disabled={isLoading2}
                        onChange={onChangeInput}
                      />
                    </div>
                  }

                  <div className="col">
                    <TextField
                      type="password"
                      label="New Password"
                      variant="outlined"
                      size="small"
                      className="w-full"
                      name="newPassword"
                      value={changePassword.newPassword || ""}
                      onChange={onChangeInput}
                    />
                  </div>

                  <div className="col">
                    <TextField
                      label="Confirm Password"
                      variant="outlined"
                      size="small"
                      className="w-full"
                      name="confirmPassword"
                      type="password"
                      value={changePassword.confirmPassword || ""}
                      onChange={onChangeInput}
                    />
                  </div>
                </div>

                <br />

                <div className="flex items-center gap-4">
                  <Button type="submit" className="btn-org btn-sm w-[200px]">
                    {isLoading2 ? <CircularProgress color="inherit" size={20} /> : 'Change Password'}
                  </Button>
                </div>
              </form>
            </div>
          </Collapse>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
