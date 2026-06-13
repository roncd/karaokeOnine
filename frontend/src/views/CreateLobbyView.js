// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   Image,
//   TextInput,
//   Clipboard
// } from 'react-native';

// import styles from './viewStyles/CreateLobbyView.styles';
// import AvatarPicker from '../components/AvatarPicker';

// export default function CreateLobbyView({ lobbyId, onBack, onShare, onStart, pseudo, onChangePseudo, avatarIndex, onSelectAvatar, onGenerate }) {
//   return (
//     <SafeAreaView style={styles.safe}>
//       <View style={styles.container}>

//         {/* Logo */}
//         <Image
//           source={require('../../assets/logo/logo_karaoke.png')}
//           style={styles.logo}
//         />

//         {/* Titre */}
//         <View style={styles.titleBlock}>
//           <Text style={styles.title}>Créer un salon</Text>
//           <Text style={styles.subtitle}>Générez un code unique à 6 caractères</Text>
//         </View>

//         {/* Code */}
//         <View style={styles.idBlock}>
//           {lobbyId ? (
//             <View style={styles.codeRow}>
//               <Text style={styles.codeText}>{lobbyId}</Text>

//               <TouchableOpacity 
//                 onPress={() => Clipboard.setString(lobbyId)} 
//                 style={styles.copyBtn}
//               >
//                 <Image
//                   source={require('../../assets/icon/copie-icon.png')}
//                   style={styles.copyIcon}
//                 />
//               </TouchableOpacity>
//             </View>
//           ) : (
            
//           <View style={styles.inputBlock}>
//             <View style={[styles.input, { justifyContent: 'center', alignItems: 'center' }]}>
              
//               {/* Texte centré */}
//               <Text
//                 style={{
//                   color: lobbyId ? YELLOW : 'rgba(245,230,66,0.3)',
//                   fontSize: 26,
//                   fontWeight: '900',
//                   letterSpacing: 16,
//                   textAlign: 'center',
//                 }}
//               >
//                 {lobbyId || '------'}
//               </Text>

//               {/* Bouton copier en position absolue */}
//               {lobbyId && (
//                 <TouchableOpacity
//                   onPress={() => Clipboard.setString(lobbyId)}
//                   style={{
//                     position: 'absolute',
//                     right: 16,
//                     padding: 4,
//                   }}
//                 >
//                   <Image
//                     source={require('../../assets/icon/copie-icon.png')}
//                     style={styles.copyIcon}
//                   />
//                 </TouchableOpacity>
//               )}

//             </View>
//           </View>

//           )}
//         </View>

//         {/* Pseudo */}
//         <View style={styles.titleBlock}>
//           <Text style={{ color: '#fff', opacity: 0.7 }}>Votre pseudo</Text>
//         </View>

//         <View style={styles.idBlock}>
//           <TextInput
//             style={styles.pseudoInput}
//             value={pseudo}
//             onChangeText={onChangePseudo}
//             placeholder="Entrez votre pseudo"
//             placeholderTextColor="rgba(255,255,255,0.3)"
//           />
//         </View>

//         {/* Avatar */}
//         <View style={styles.titleBlock}>
//           <Text style={{ color: '#fff', opacity: 0.7 }}>Votre avatar</Text>
//         </View>
//         <AvatarPicker selected={avatarIndex} onSelect={onSelectAvatar} />

//         {/* Boutons */}
//         <View style={styles.actions}>
//           <TouchableOpacity style={styles.generateBtn} onPress={onGenerate} activeOpacity={0.8}>
//           <Text style={styles.generateBtnText}>Générer</Text>
//           </TouchableOpacity>
//           {onStart && (
//             <TouchableOpacity
//               style={styles.startBtn}
//               onPress={onStart}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.startBtnText}>Démarrer le salon</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//       </View>
//     </SafeAreaView>
//   );
// }
import React from 'react';
import {
   View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  Clipboard
} from 'react-native';

import styles from './viewStyles/CreateLobbyView.styles';
import AvatarPicker from '../components/AvatarPicker';

export default function CreateLobbyView({
  lobbyId,
  onBack,
  onShare,
  onStart,
  pseudo,
  onChangePseudo,
  avatarIndex,
  onSelectAvatar,
  onGenerate
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Logo */}
        <Image
          source={require('../../assets/logo/logo_karaoke.png')}
          style={styles.logo}
        />

        {/* Titre */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Créer un salon</Text>
          <Text style={styles.subtitle}>Générez un code unique à 6 caractères</Text>
        </View>

        {/* Code */}
        <View style={styles.idBlock}>
          <View
            style={[
              styles.input,
              {
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }
            ]}
          >
            {/* Texte centré */}
            <Text
              style={{
                color: lobbyId ? '#F5E642' : 'rgba(245,230,66,0.3)',
                fontSize: 26,
                fontWeight: '900',
                letterSpacing: 16,
                textAlign: 'center',
              }}
            >
              {lobbyId || '------'}
            </Text>

            {/* Bouton copier en position absolue */}
            {lobbyId && (
              <TouchableOpacity
                onPress={() => Clipboard.setString(lobbyId)}
                style={{
                  position: 'absolute',
                  right: 16,
                  padding: 4,
                }}
              >
                <Image
                  source={require('../../assets/icon/copie-icon.png')}
                  style={styles.copyIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Pseudo */}
        <View style={styles.titleBlock}>
          <Text style={{ color: '#fff', opacity: 0.7 }}>Votre pseudo</Text>
        </View>

        <View style={styles.idBlock}>
          <TextInput
            style={styles.pseudoInput}
            value={pseudo}
            onChangeText={onChangePseudo}
            placeholder="Entrez votre pseudo"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
        </View>

        {/* Avatar */}
        <View style={styles.titleBlock}>
          <Text style={{ color: '#fff', opacity: 0.7 }}>Votre avatar</Text>
        </View>
        <AvatarPicker selected={avatarIndex} onSelect={onSelectAvatar} />

        {/* Boutons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.generateBtn} onPress={onGenerate} activeOpacity={0.8}>
            <Text style={styles.generateBtnText}>Générer</Text>
          </TouchableOpacity>

          {onStart && (
            <TouchableOpacity
              style={styles.startBtn}
              onPress={onStart}
              activeOpacity={0.8}
            >
              <Text style={styles.startBtnText}>Démarrer le salon</Text>
            </TouchableOpacity>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}
