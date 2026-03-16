import nodemailer from 'nodemailer'

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env

const isSmtpConfigured = SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS

const transporter = isSmtpConfigured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  : null

interface MailOptions {
  to: string | string[]
  subject: string
  html: string
}

export async function sendMail(options: MailOptions): Promise<void> {
  if (!transporter) {
    console.log('[EmailService] SMTP not configured — skipping send')
    console.log(`  To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`)
    console.log(`  Subject: ${options.subject}`)
    return
  }
  try {
    await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
  } catch (err) {
    console.error('[EmailService] Failed to send email:', err)
    // Do not throw — email failure should not break the request
  }
}

// ── Pre-built email templates ──────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string, password: string): Promise<void> {
  await sendMail({
    to,
    subject: '歡迎加入 — 您的帳號已建立',
    html: `
      <h2>歡迎，${name}！</h2>
      <p>您的帳號已建立成功，以下是您的初始登入資訊：</p>
      <ul>
        <li><strong>Email：</strong>${to}</li>
        <li><strong>初始密碼：</strong>${password}</li>
      </ul>
      <p>請登入後立即修改密碼。</p>
    `,
  })
}

export async function sendLeaveRequestNotification(
  supervisorEmail: string,
  employeeName: string,
  leaveType: string,
  startDate: string,
  endDate: string,
): Promise<void> {
  await sendMail({
    to: supervisorEmail,
    subject: `假單申請通知 — ${employeeName}`,
    html: `
      <h3>假單申請待審核</h3>
      <p><strong>${employeeName}</strong> 提交了一份假單申請，請前往系統審核。</p>
      <ul>
        <li><strong>假別：</strong>${leaveType}</li>
        <li><strong>起始日：</strong>${startDate}</li>
        <li><strong>結束日：</strong>${endDate}</li>
      </ul>
    `,
  })
}

export async function sendOvertimeRequestNotification(
  supervisorEmail: string,
  employeeName: string,
  date: string,
  hours: number,
): Promise<void> {
  await sendMail({
    to: supervisorEmail,
    subject: `加班申請通知 — ${employeeName}`,
    html: `
      <h3>加班申請待審核</h3>
      <p><strong>${employeeName}</strong> 提交了一份加班申請，請前往系統審核。</p>
      <ul>
        <li><strong>日期：</strong>${date}</li>
        <li><strong>加班時數：</strong>${hours} 小時</li>
      </ul>
    `,
  })
}

export async function sendSupervisorApprovedLeaveNotification(
  employeeEmail: string,
  employeeName: string,
  hrEmails: string[],
): Promise<void> {
  await sendMail({
    to: employeeEmail,
    subject: '假單已通過主管審核，待 HR 最終核准',
    html: `<p>${employeeName}，您的假單已通過主管審核，目前正等候 HR 最終核准。</p>`,
  })
  if (hrEmails.length > 0) {
    await sendMail({
      to: hrEmails,
      subject: '假單待 HR 核准',
      html: `<p>${employeeName} 的假單已通過主管審核，請前往系統進行最終核准。</p>`,
    })
  }
}

export async function sendHrApprovedLeaveNotification(
  employeeEmail: string,
  employeeName: string,
): Promise<void> {
  await sendMail({
    to: employeeEmail,
    subject: '假單已核准',
    html: `<p>${employeeName}，您的假單已獲得最終核准。</p>`,
  })
}

export async function sendRejectedLeaveNotification(
  employeeEmail: string,
  employeeName: string,
  comment: string,
): Promise<void> {
  await sendMail({
    to: employeeEmail,
    subject: '假單申請未通過',
    html: `
      <p>${employeeName}，您的假單申請未通過審核。</p>
      ${comment ? `<p><strong>原因：</strong>${comment}</p>` : ''}
    `,
  })
}

export async function sendProxyNotification(
  proxyEmail: string,
  proxyName: string,
  applicantName: string,
  startDate: string,
  endDate: string,
): Promise<void> {
  await sendMail({
    to: proxyEmail,
    subject: `您被指定為假單代理人 — ${applicantName}`,
    html: `
      <p>${proxyName}，您好。</p>
      <p>您被指定為 <strong>${applicantName}</strong> 假單期間（${startDate} ～ ${endDate}）的代理人。</p>
    `,
  })
}

export async function sendSupervisorApprovedOvertimeNotification(
  employeeEmail: string,
  employeeName: string,
  hrEmails: string[],
): Promise<void> {
  await sendMail({
    to: employeeEmail,
    subject: '加班申請已通過主管審核，待 HR 最終核准',
    html: `<p>${employeeName}，您的加班申請已通過主管審核，目前正等候 HR 最終核准。</p>`,
  })
  if (hrEmails.length > 0) {
    await sendMail({
      to: hrEmails,
      subject: '加班申請待 HR 核准',
      html: `<p>${employeeName} 的加班申請已通過主管審核，請前往系統進行最終核准。</p>`,
    })
  }
}

export async function sendHrApprovedOvertimeNotification(
  employeeEmail: string,
  employeeName: string,
): Promise<void> {
  await sendMail({
    to: employeeEmail,
    subject: '加班申請已核准',
    html: `<p>${employeeName}，您的加班申請已獲得最終核准。</p>`,
  })
}

export async function sendRejectedOvertimeNotification(
  employeeEmail: string,
  employeeName: string,
  comment: string,
): Promise<void> {
  await sendMail({
    to: employeeEmail,
    subject: '加班申請未通過',
    html: `
      <p>${employeeName}，您的加班申請未通過審核。</p>
      ${comment ? `<p><strong>原因：</strong>${comment}</p>` : ''}
    `,
  })
}
