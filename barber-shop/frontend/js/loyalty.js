/**
 * Loyalty Module — Handles points display, redemption, and tier info.
 */

function initLoyalty() {
  updateLoyaltyUI();
}

function updateLoyaltyUI() {
  const overview = document.getElementById('loyaltyOverview');
  const dashboard = document.getElementById('loyaltyDashboard');

  if (isLoggedIn()) {
    overview.classList.add('hidden');
    dashboard.classList.remove('hidden');
    loadLoyaltyData();
  } else {
    overview.classList.remove('hidden');
    dashboard.classList.add('hidden');
  }
}

async function loadLoyaltyData() {
  const dashboard = document.getElementById('loyaltyDashboard');

  try {
    const data = await API.get('/loyalty/me');
    const loyalty = data.loyalty;

    dashboard.innerHTML = `
      <div class="loyalty-dashboard">
        <div class="loyalty-stats">
          <div class="stat-card">
            <div class="value">${loyalty.points}</div>
            <div class="label">Points</div>
          </div>
          <div class="stat-card">
            <div class="value">${loyalty.totalVisits}</div>
            <div class="label">Total Visits</div>
          </div>
          <div class="stat-card">
            <div class="value badge badge-${loyalty.tier}">${loyalty.tier}</div>
            <div class="label">Current Tier</div>
          </div>
        </div>
        <div class="points-history">
          <h4>Points History</h4>
          ${renderHistory(loyalty.history)}
        </div>
      </div>
    `;
  } catch (err) {
    dashboard.innerHTML = '<p style="text-align:center;color:var(--text-soft)">Unable to load loyalty data.</p>';
  }
}

function renderHistory(history) {
  if (!history || history.length === 0) {
    return '<p style="color:var(--text-soft);text-align:center;padding:1rem;">No activity yet. Book your first appointment to start earning!</p>';
  }

  return history
    .slice(-10)
    .reverse()
    .map(
      (item) => `
      <div class="history-item">
        <div>
          <strong>${item.description}</strong>
          <br><small>${new Date(item.date).toLocaleDateString()}</small>
        </div>
        <span class="${item.action}">${item.action === 'earned' ? '+' : '-'}${item.points} pts</span>
      </div>
    `
    )
    .join('');
}

async function redeemPoints(points, description) {
  try {
    await API.post('/loyalty/redeem', { points, description });
    showToast(`Redeemed ${points} points!`, 'success');
    loadLoyaltyData();
  } catch (err) {
    showToast(err.message, 'error');
  }
}
