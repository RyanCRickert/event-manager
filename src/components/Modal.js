import React from "react";

import Backdrop from "./Backdrop";

const Modal = props => (
  <React.Fragment>
    <Backdrop />
    <div className="modal">
      <header className="modal__header"><h1>{props.title}</h1></header>
      <section className="modal__content">{props.children}</section>
      <section className="modal__actions">
      {props.canCancel && <button className="btn" onClick={props.onModalCancel}>{props.cancelText}</button>}
      {props.canConfirm && <button className="btn" onClick={props.onModalConfirm}>{props.confirmText}</button>}
      </section>
    </div>
  </React.Fragment>
);

export default Modal;