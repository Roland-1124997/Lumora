<template>
	<EHtml>
		<EHead>
			<EStyle> body { margin: 0 !important; padding: 0 !important; -webkit-font-smoothing:antialiased; } </EStyle>
		</EHead>
		<EBody>
			<EPreview> We have received a request to reset your password. Use the code below to proceed. </EPreview>
			<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse">
				<tbody>
					<tr>
						<td align="left">
							<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; border-collapse: collapse">
								<tbody>
									<tr>
										<td style="background: #ffffff; padding: 28px; font-family: Arial, Helvetica, sans-serif">
											<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse">
												<tbody>
													<tr>
														<td style="padding-bottom: 12px; vertical-align: middle">
															<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: collapse">
																<tbody>
																	<tr>
																		<td style="vertical-align: middle; padding-right: 12px">
																			<EImg src="https://lumora.roland-meijer.nl/_ipx/_/icons/icon_dark_512.png" alt="Lumora" width="40" height="40" style="display: block; border: 0; outline: none; text-decoration: none" />
																		</td>
																		<td style="vertical-align: middle">
																			<div style="font-size: 18px; color: #0f172a; font-weight: 700">Lumora</div>
																			<div style="font-size: 12px; color: #6b7280; margin-top: 2px">Security center</div>
																		</td>
																	</tr>
																</tbody>
															</table>
														</td>
													</tr>
													<tr>
														<td style="border-top: 1px solid #e6edf3; padding-top: 18px">
															<h1 style="margin: 6px 0 12px 0; color: #0f172a; font-size: 32px; font-weight: 700; line-height: 1.1">Reset your password</h1>
															<p style="margin: 0 0 16px 0; color: #374151; font-size: 14px; line-height: 1.6">You requested a password reset. Please enter the following code in the password reset form to continue:</p>
															<div role="textbox" aria-label="Reset code" style="display: block; background: #f8fafc; border: 1px dashed #e6edf3; padding: 14px 20px; font-weight: 700; font-size: 22px; letter-spacing: 6px; border-radius: 8px; font-family: 'Courier New', Courier, monospace; color: #0f172a; text-align: center; max-width: 240px; margin: 18px 0">{{ token || "Unknown" }}</div>
															<p style="margin: 0; color: #6b7280; font-size: 12px">If you did not request a password reset, you can safely ignore this email.</p>
															<p style="margin: 12px 0 0">
																<a href="https://lumora.roland-meijer.nl" style="text-decoration: underline; font-weight: 700; font-size: 10px" target="_blank" rel="noopener"> lumora.roland-meijer.nl </a>
															</p>
														</td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
		</EBody>
	</EHtml>
</template>

<script setup lang="ts">
	defineProps<{
		token: string;
	}>();
</script>
