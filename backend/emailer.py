from flask_mail import Mail, Message
from report import generate_prediction_report
import os

mail = Mail()

def init_mail(app):
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = 'shubhampandey050705@gmail.com'
    app.config['MAIL_PASSWORD'] = 'pdugrpubethjkzch'
    app.config['MAIL_DEFAULT_SENDER'] = app.config['MAIL_USERNAME']
    mail.init_app(app)

def send_prediction_email(recipient_email, result, user=None):
    subject = str("Your Heart Disease Prediction Report")

    print("✅ DEBUG — Subject type:", type(subject), "Value:", subject)

    body = f"""Hello {user.name if user else 'User'},

Your heart disease prediction result is: {result}.

A detailed report is attached.

Stay healthy! 🫀
– HeartCare AI
"""

    try:
        msg = Message(
            subject=subject,
            recipients=[recipient_email],
            body=body
        )

        os.makedirs("temp_reports", exist_ok=True)
        pdf_path = f"temp_reports/{user.id}_report.pdf"
        generate_prediction_report(user, result, pdf_path)

        with open(pdf_path, "rb") as f:
            msg.attach("Heart_Prediction_Report.pdf", "application/pdf", f.read())

        mail.send(msg)
        print("✅ Email sent successfully!")

    except Exception as e:
        print("❌ Email sending failed:", e)
        raise
