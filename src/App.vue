<script setup>
import { onMounted, ref } from "vue";
import { eventBus, walletState } from "./utils/eventBus";

// 전역 상태 사용
const account = ref(walletState.value.account);
const isConnected = ref(walletState.value.isConnected);
const balance = ref(walletState.value.balance);
const tokenBalance = ref(walletState.value.tokenBalance);
const totalSupply = ref(walletState.value.totalSupply);

// Home 뷰 참조
const homeView = ref(null);

// 지갑 연결 함수
const connectWallet = async () => {
  console.log("App.vue: 지갑 연결 시도");
  if (homeView.value && homeView.value.connectWallet) {
    console.log("Home 뷰의 connectWallet 함수 호출");
    await homeView.value.connectWallet();
  } else {
    console.log(
      "Home 뷰가 아직 마운트되지 않았거나 connectWallet 함수가 없습니다"
    );
    // Home 뷰가 없을 때 직접 연결 시도
    eventBus.emit("connectWallet");
  }
};

// 지갑 연결 해제 함수
const disconnectWallet = async () => {
  console.log("App.vue: 지갑 연결 해제");
  if (homeView.value && homeView.value.disconnectWallet) {
    await homeView.value.disconnectWallet();
  } else {
    eventBus.emit("disconnectWallet");
  }
};

// 토큰 전송 모달 열기
const openTransferModal = () => {
  if (homeView.value && homeView.value.openTransferModal) {
    homeView.value.openTransferModal();
  } else {
    eventBus.emit("openTransferModal");
  }
};

// 지갑 상태 변경 이벤트 리스너
const handleWalletStateChange = (newState) => {
  account.value = newState.account;
  isConnected.value = newState.isConnected;
  balance.value = newState.balance;
  tokenBalance.value = newState.tokenBalance;
  totalSupply.value = newState.totalSupply;
  console.log("App.vue: 지갑 상태 업데이트", newState);
};

// 컴포넌트 마운트 시 이벤트 리스너 설정
onMounted(() => {
  eventBus.on("walletStateChanged", handleWalletStateChange);

  // 초기 상태 설정 (localStorage에서 복원된 상태)
  handleWalletStateChange(walletState.value);

  console.log("App.vue 마운트 - 초기 지갑 상태:", walletState.value);
});
</script>

<template>
  <div class="min-vh-100 bg-gradient-primary">
    <!-- 상단 탑바 -->
    <nav
      class="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-75 backdrop-blur"
    >
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold" to="/">
          <i class="bi bi-currency-bitcoin me-2"></i>
          블록체인 지갑
        </router-link>

        <!-- 네비게이션 메뉴 -->
        <div class="navbar-nav me-auto">
          <router-link class="nav-link" to="/" active-class="active">
            <i class="bi bi-house me-1"></i>
            Home
          </router-link>
          <router-link class="nav-link" to="/dex" active-class="active">
            <i class="bi bi-arrow-left-right me-1"></i>
            DEX
          </router-link>
        </div>

        <!-- 지갑 연결 버튼 -->
        <div class="navbar-nav ms-auto">
          <div v-if="!isConnected" class="nav-item">
            <button
              @click="connectWallet"
              class="btn btn-primary btn-sm px-3 py-2"
            >
              <i class="bi bi-wallet2 me-2"></i>
              지갑 연결
            </button>
          </div>

          <div v-else class="nav-item dropdown">
            <button
              class="btn btn-outline-light btn-sm dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person-circle me-2"></i>
              {{ account.substring(0, 6) }}...{{ account.substring(38) }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><h6 class="dropdown-header">계정 정보</h6></li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <span class="dropdown-item-text">
                  <small class="text-muted">잔액:</small><br />
                  <strong class="text-success">{{ balance }} ETH</strong>
                </span>
              </li>
              <li>
                <span class="dropdown-item-text">
                  <small class="text-muted">토큰:</small><br />
                  <strong class="text-success">{{ tokenBalance }} KSH</strong>
                </span>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button @click="openTransferModal" class="dropdown-item">
                  <i class="bi bi-send me-2"></i>
                  토큰 전송
                </button>
              </li>
              <li>
                <button
                  @click="disconnectWallet"
                  class="dropdown-item text-danger"
                >
                  <i class="bi bi-x-circle me-2"></i>
                  연결 해제
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- 라우터 뷰 -->
    <router-view ref="homeView" />
  </div>
</template>
