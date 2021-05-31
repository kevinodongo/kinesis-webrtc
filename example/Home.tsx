import * as React from "react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router";
import "./index.css";
import { encryptValue } from "./helpers";
import { v4 as uuidv4 } from "uuid";

interface MyFormValues {
  aws__region: string;
  aws__key: string;
  aws__secret__access: string;
  session__name: string;
}

// yup session schema
const sessionSchema = Yup.object({
  aws__region: Yup.string().required("This field is required."),
  aws__key: Yup.string().required("This field is required."),
  aws__secret__access: Yup.string().required("This field is required."),
  session__name: Yup.string().required("This field is required."),
});

function Home() {
  const history = useHistory();
  const [isLoading, setisLoading] = React.useState<boolean>(false);
  const initialValues: MyFormValues = {
    aws__region: "",
    aws__key: "",
    aws__secret__access: "",
    session__name: uuidv4(),
  };

  return (
    <div id="homeContainer">
      <section className="sectionContent">
        <div id="sectionLayout">
          <div id="columnHomeForm">
            <div id="formSection">
              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={sessionSchema}
                onSubmit={(values, actions) => {
                  setisLoading(true);
                  // set session storage
                  sessionStorage.setItem("@role", "master");
                  // set config
                  const _config = {
                    region: values.aws__region,
                    accessKeyId: values.aws__key,
                    secretAccessKey: values.aws__secret__access,
                    sessionName: values.session__name,
                  };
                  // encrypt data and send to session
                  const encryptionResponse = encryptValue(_config);
                  const path = `/${encryptionResponse}`;
                  history.push(path);
                  actions.setSubmitting(false);
                  actions.resetForm();
                }}
              >
                {({ errors, touched, handleSubmit, isValid }) => (
                  <Form onSubmit={handleSubmit}>
                    <div>
                      <div className="homeTitle">
                        Kinesis Video Stream Example
                      </div>
                      <p className="homeText">
                        Amazon Kinesis Video Streams makes it easy to securely
                        stream media from connected devices to AWS for storage,
                        analytics, machine learning (ML), playback, and other
                        processing. This demo we will be launched in your AWS
                        Account.
                      </p>
                    </div>

                    <div>
                      {/*text textfield*/}
                      <div>
                        <label htmlFor="region" className="labelText">
                          AWS Region <span style={{ color: "red" }}>*</span>
                        </label>
                        {errors.aws__region && touched.aws__region ? (
                          <div
                            data-testid="region__error"
                            id="region__error"
                            style={{ color: "red", fontSize: "12px" }}
                          >
                            {errors.aws__region}
                          </div>
                        ) : null}
                        <Field
                          placeholder="AWS Region"
                          id="aws__region"
                          name="aws__region"
                          type="text"
                          className="homeInput"
                        />
                      </div>

                      {/*text textfield*/}
                      <div>
                        <label htmlFor="key" className="labelText">
                          AWS Access Key Id{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        {errors.aws__key && touched.aws__key ? (
                          <div
                            data-testid="key__error"
                            id="key__error"
                            style={{ color: "red", fontSize: "12px" }}
                          >
                            {errors.aws__key}
                          </div>
                        ) : null}
                        <Field
                          placeholder="AWS Access Key Id"
                          id="aws__key"
                          name="aws__key"
                          type="text"
                          className="homeInput"
                        />
                      </div>

                      {/*text textfield*/}
                      <div>
                        <label htmlFor="secret" className="labelText">
                          AWS Secret Access Key{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        {errors.aws__secret__access &&
                        touched.aws__secret__access ? (
                          <div
                            data-testid="secret__error"
                            id="secret__error"
                            style={{ color: "red", fontSize: "12px" }}
                          >
                            {errors.aws__secret__access}
                          </div>
                        ) : null}
                        <Field
                          placeholder="AWS Secret Access Key"
                          id="aws__secret__access"
                          name="aws__secret__access"
                          type="text"
                          className="homeInput"
                        />
                      </div>

                      {/*session name textfield*/}
                      <div className="spacing">
                        <label htmlFor="session__name" className="labelText">
                          Session name
                        </label>
                        {errors.session__name && touched.session__name ? (
                          <div
                            data-testid="session__error"
                            id="session__error"
                            style={{ color: "red" }}
                          >
                            {errors.session__name}
                          </div>
                        ) : null}
                        <Field
                          readOnly
                          id="session__name"
                          name="session__name"
                          type="text"
                          className="homeInput"
                        />
                      </div>

                      {/*submit button*/}
                      <div>
                        <button
                          id="session__button"
                          disabled={isLoading && isValid}
                          type="submit"
                          className="homeButton"
                        >
                          {isLoading && isValid ? (
                            <span>Processing....</span>
                          ) : (
                            <span>Start Session</span>
                          )}
                        </button>
                      </div>

                      {/*end*/}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <div id="columnHomeImage"></div>
        </div>
      </section>
    </div>
  );
}

export default Home;
