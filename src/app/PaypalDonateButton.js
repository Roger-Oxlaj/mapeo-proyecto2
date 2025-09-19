<<<<<<< HEAD
export default function PaypalDonateButton() {
  return (
    <form
      style={{ textAlign: "center" }}
      action="https://www.paypal.com/donate"
      method="post"
      target="_blank" // <-- abre en otra pestaña
      rel="noopener noreferrer" // <-- buena práctica por seguridad
    >
      <p style={{ fontSize: "24px", fontWeight: "bold", fontStyle: "italic" }}>
        Apoya al creador
      </p>
      <input type="hidden" name="hosted_button_id" value="E8NWCWP449YDS" />
      <input
        type="image"
        src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
        style={{ width: "200px", height: "auto" }}
        border="0"
        name="submit"
        title="PayPal - The safer, easier way to pay online!"
        alt="Donate with PayPal button"
      />
      <img
        alt=""
        border="0"
        src="https://www.paypal.com/en_GT/i/scr/pixel.gif"
        width="1"
        height="1"
      />
    </form>
  );
}
=======
export default function PaypalDonateButton() {
  return (
    <form
      style={{ textAlign: "center" }}
      action="https://www.paypal.com/donate"
      method="post"
      target="_blank" // <-- abre en otra pestaña
      rel="noopener noreferrer" // <-- buena práctica por seguridad
    >
      <p style={{ fontSize: "24px", fontWeight: "bold", fontStyle: "italic" }}>
        Apoya al creador
      </p>
      <input type="hidden" name="hosted_button_id" value="E8NWCWP449YDS" />
      <input
        type="image"
        src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
        style={{ width: "200px", height: "auto" }}
        border="0"
        name="submit"
        title="PayPal - The safer, easier way to pay online!"
        alt="Donate with PayPal button"
      />
      <img
        alt=""
        border="0"
        src="https://www.paypal.com/en_GT/i/scr/pixel.gif"
        width="1"
        height="1"
      />
    </form>
  );
}
>>>>>>> 4f8914e (actualizado)
