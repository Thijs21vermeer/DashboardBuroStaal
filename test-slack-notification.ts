import 'dotenv/config';

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;

async function testSlackNotification() {
  console.log('🧪 Testing Slack Notification\n');
  
  if (!SLACK_WEBHOOK) {
    console.error('❌ SLACK_WEBHOOK not found in .env');
    process.exit(1);
  }
  
  console.log('✅ Webhook URL found');
  console.log('🔗 URL:', SLACK_WEBHOOK.substring(0, 50) + '...\n');

  const testItem = {
    titel: 'Test Kennisitem',
    samenvatting: 'Dit is een test notificatie vanuit het test script'
  };

  const message = {
    text: `📚 Nieuw kennisitem: ${testItem.titel}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📚 Nieuw Kennisitem Toegevoegd",
          emoji: true
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${testItem.titel}*\n\n${testItem.samenvatting}`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<https://burostaaldashboard.netlify.app|Bekijk in dashboard ›>`
        }
      }
    ]
  };

  try {
    console.log('📤 Sending test notification to Slack...');
    const response = await fetch(SLACK_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('❌ Failed!');
      console.error('Status:', response.status, response.statusText);
      console.error('Response:', responseText);
      process.exit(1);
    } else {
      console.log('✅ Success!');
      console.log('Response:', responseText);
      console.log('\n🎉 Check your Slack channel for the test message!');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testSlackNotification();
